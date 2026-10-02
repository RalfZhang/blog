---
title: {{ replaceRE `^\d{4}-\d{2}-\d{2}-` "" .File.ContentBaseName | humanize }}
date: {{ .Date }}
tags:
slug: {{ replaceRE `^\d{4}-\d{2}-\d{2}-` "" .File.ContentBaseName }}
---
