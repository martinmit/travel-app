# travel-app

## Table of Contents

* [Introduction(#introduction)]
* [Overview(#overview)]
* [CodeDetails(#codedetails)]

## Introduction

This app allows the user to input a travel location and date and get some information about the location. Furthermore the user can save the trips and reload the information. 

## Overview

The code mainly consists of three parts
A part which calls three APIs to get the information about the location
A second part which then updates the view
A third part which stores the received information in the browser's local storage so it can be accessed when the user returns to the site
The app is using webpack for the build process and jest for testing. For offline functionality a service worker is installed.

## CodeDetails

### API Data Collection
The first function collects all API information and saves it to later display it. I chose a chain of promises for the implementation which makes sure that only when the data from the API is retrieved the next API is called. To avoid cors-issues I route the requests to the APIs via cors-anywhere (as the cors-errors do not occur when a server requests the ressource).

### Updating the view with the collected data
The data is stored in an object which then later on is used to update the view and present the user with the information. This is done with classical DOM manipulation methods.

### Storing the data in the local storage
The last part handles the local storage. In the beginning an array is initialized to save the past trips. As soon as the site is loaded again, the app checks the local storage and retrieves the past trips information if there is any. Then it is displayed in a separate part of the UI where the user can choose past trips and have the information displayed again.