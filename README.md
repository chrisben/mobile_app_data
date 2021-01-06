# Mobile App Data

## What is it?
From a simple JSON data file, generates automatically Swift, Kotlin and Java classes that match the data structure and offer static objects initialized with the given data. It also handles Optional types when data is not always provided.

## Why do I need it?
Native Android and iOS mobile apps may share some common data (constants, texts).

This kind of data is usually retrieved from a server, but there might be no server, it should be available offline, or having to deal with i18n on the server gets complicated for a few texts.
That kind of data can be duplicated between the two source codes but it gets complicated to update and it's highly error-prone.

One solution to this problem would be to have a single data file (json/xml/..), but there are drawbacks with that:
- code that loads this file has to be written, for both platforms
- no code-completion while developing, making it also error-prone (if the data structure is modified, there will be no notification to update the code that uses it)
- loading data can slow down the app startup
- no way to use built-in platform internationalization features
- plain data files can potentially be extracted more easily from the app by anyone (if your data contains things you would not like the world to know..easily)

## How to run it?
Provide an input json file, an output folder and an Android app class name (`com.domain.android.myapp`), for instance `app_data.json`
```
node index.js input/app_data.json project/data com.domain.android.app
```
It will generate the following files into the output folder: `AppData.java`, `AppData.kt`, `AppData.swift` (the name of the files and the main class+object is generated from the input filename)

## How to add it to my project?
- Add the generation step as part of your project compilation and set the output to a folder within your project
- In XCode / AndroidStudio, add the class file to your project
- You can optionally add the generated file to your .gitignore file, as it's a generated file you might better keep the source json file instead
- You can now start coding and even use autocompletion to access the data
