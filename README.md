
<h1 align="center">
  <br>
  <a href="https://code-collab-pink.vercel.app"><img src="https://raw.githubusercontent.com/amRohitKumar/Code-Collab/master/public/readme-assets/title.png" alt="Code-Collab" width="400"></a>
  <br>
  Code-Collab
  <br>
</h1>

<h4 align="center">A collaborative coding platform where users can create virtual rooms, code together in real-time using an integrated IDE, built on top of <a href="https://microsoft.github.io/monaco-editor/" target="_blank">Monaco Editor</a>.</h4>

<!-- <p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  </a>
  <a href="https://gitter.im/amitmerchant1990/electron-markdownify"><img src="https://badges.gitter.im/amitmerchant1990/electron-markdownify.svg"></a>
  <a href="https://saythanks.io/to/bullredeyes@gmail.com">
      <img src="https://img.shields.io/badge/SayThanks.io-%E2%98%BC-1EAEDB.svg">
  </a>
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p> -->

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Setup</a> •
  <a href="#credits">Tech Stack</a> •
  <a href="#related">Connect</a>
</p>

![screenshot](https://raw.githubusercontent.com/amRohitKumar/Code-Collab/master/public/readme-assets/working.gif)
## Key Features

* Real-Time Collaboration - Make changes, See changes
  - Code together seamlessly with live updates, breaking geographical barriers for efficient teamwork.
* Multi-Language Support
  - Code in your language of choice; our platform supports a diverse range of programming languages for project development.
* Live Output Preview
  -  Instantly visualize code changes with live output preview, streamlining debugging and accelerating development.
* Create and Join Rooms
  - Establish focused coding spaces with dedicated rooms, enhancing communication and organization for collaborative coding.
* Dark/Light mode
* Compiler 
  - Compile and execute code in compiled languages with ease.
* Supports multiple cursors

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone frontend repository
$ git clone https://github.com/amRohitKumar/Code-Collab

# Go into the repository
$ cd Code-Collab

# Install dependencies
$ npm install

# Run the app
$ npm run dev

# Now clone backend repository
$ git clone https://github.com/amRohitKumar/code-collab-server

# Go into the repository
$ cd code-collab-server

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

> **Note**
> You need to run these servers concurrently. You can do this by opening multiple terminals or multiple code editors.


## Setup

Add following environmental variables 

- Server

```Plaintext
 # Sample .env file

  - JWT_SECRET = "dlfsxxxx"
  - JWT_EXP = "5d"
  - ROOM_JWT_EXP = "2d"
  - POSTGRES_PRISMA_URL = "postgress://xxxxxxxx"

```

- Client

```Plaintext
 # Sample .env file

  - NEXTAUTH_SECRET = "dlfsxxxx"
  - HACKEREARTH_CLIENT_ID = "dfsdxxxx"
  - HACKEREARTH_CLIENT_KEY = "hjhjhxxxxx"

``` 

## ScreenShots

![Dashboard](https://raw.githubusercontent.com/amRohitKumar/Code-Collab/master/public/readme-assets/dashboard.png)
![Code Ide](https://raw.githubusercontent.com/amRohitKumar/Code-Collab/master/public/code_ide.png)

## Tech Stack

This software uses the following softwares-

- [Node.js](https://nodejs.org/)
- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Tailwind](https://tailwindcss.com/)

## Connect

- [Rohit](https://www.linkedin.com/in/rohit-kumar-8ba1241bb/)

