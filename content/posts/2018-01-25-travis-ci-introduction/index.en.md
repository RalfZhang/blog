---
title: Getting Started with Travis CI
date: 2018-01-25 14:34:00
slug: travis-ci-introduction
---

# The Problem  
Once we finish a feature, we usually need to build the project and publish it to a server. The "simplest" way is to build it locally and send it to the server by hand, with scp or similar. But that is tedious, since we have to go through the whole process manually every time. So we want a way to automate it.

# The Solution  
Here we use Travis CI for [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration). It works with GitHub and provides an online command runner that reads the `.travis.yml` config file in the project and runs the commands configured in it.  
Taking [this project](https://github.com/RalfZhang/vdo) as an example, we watch the project's master branch. Once development on the dev branch is done, we merge the changes into master. Travis then detects the change on master and runs the build command `yarn run build`. When the build is done, it runs `scp -r dist name@8.8.8.8:/direction` to deploy the dist folder to the server.  
Besides the Travis config file, there is one more problem to solve: unless it is trusted, Travis has to enter a password every time it runs scp. The fix is simple. We send the public key of our local dev machine to the server, so the server trusts the dev machine. Then we give the dev machine's private key to Travis, so Travis can pose as the dev machine and run scp without a password. (More: [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography))  
But that raises another problem. If we upload the private key to GitHub, the key becomes public, and the server gets hacked in no time. So we encrypt the private key file with Travis's encrypt-file, and Travis decrypts it when it runs. That keeps the key safe.  

# Steps
Create a `.travis.yml` file on the master branch of the GitHub project.  
Sign in to https://travis-ci.org/ with your GitHub account and enable the project you want to set up.

Generate a key pair on the local dev machine  
`ssh-keygen -t rsa`  

Copy the public key to the server (create the file on the server if it doesn't exist)  
`cat .ssh/id_rsa.pub | ssh user@8.8.8.8 "cat >> ~/.ssh/authorized_keys"`  

The server now trusts the local dev machine. Try logging in with ssh: it won't ask for a password.  

The next step is to encrypt the private key.

First, install Ruby. Some pitfalls:  
- Version 2.5.0 currently pulls in dependencies that are too new, so installing Travis fails. Version 2.4.* is recommended. (This post was published in January 2018.)  
- Because of the notoriously bad network in mainland China, installing locally may fail. I recommend sending the private key to the server and encrypting it there with Travis.

Install Travis  
`gem install travis`  

Log in with your GitHub account  
`travis login`  

In the project directory, encrypt the private key  
`travis encrypt-file  ~/.ssh/id_rsa --add`  

You'll find that `.travis.yml` now contains the following  
```yml
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in ~/.ssh/id_rsa.enc -out ~/.ssh/id_rsa -d
```

If you encrypted the key on the server, now copy the encrypted private key file `id_rsa.enc` into your local repository, and delete the unencrypted private key to stay safe.

Copy the decryption command above into your local `.travis.yml`, changing `~/.ssh/id_rsa.enc` to `./id_rsa.enc`.

That solves the main encryption problem. Next, two improvements:  
- Restrict the permissions of the id_rsa file, so that ssh will use the key file
- Add the server to Travis's list of trusted hosts  

The config file now reads:  
```yml
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- echo -e "Host 8.8.8.8\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
```

Finally, complete the rest of `.travis.yml`.  
The config file is simple, so I won't explain it further here.
```yml
language: node_js
node_js:
- node
- '8'
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- echo -e "Host 8.8.8.8\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
install:
- yarn install
script:
- yarn run build
after_success:
- scp -r dist name@8.8.8.8:/direction
```


# References
- https://docs.travis-ci.com/
- https://cnodejs.org/topic/5885f19c171f3bc843f6017e (in Chinese)
- http://www.voidcn.com/article/p-aglpzloh-c.html (in Chinese)
