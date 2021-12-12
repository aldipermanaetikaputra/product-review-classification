# Product Review Classification

This tool uses sentiment analysis to classify product reviews as negative or positive.

We use [Nestle Official Store](https://www.tokopedia.com/nestle-indonesia) and [Unilever Official Store](https://www.tokopedia.com/unilever) from Tokopedia Marketplace as our dataset to train this model. So there may be limitations on the reviews that can be used in this application.

**LIVE DEMO: [Product Review Classification](https://www.google.com)**

You can try this app from the link above.

## Important

Before going into this main section, you need to check the other important sections

- [Review Scraping Tools](./tools) : How we created our dataset from Nestle & Unilever product reviews
- [Notebooks & Dataset](./notebooks) : How we processed dataset & build model to make review classification
- [React Web Front-End](./web) : How we built front-end with React to try our model in one click
- [Server Back-End](./server) : How we built back-end with Flask to provide API to handle request from front-end

**You must follow the above instructions before running this application**

## Prerequisites

You are required to install Python 2.7 and pip Package Installer to run this app.

1. Download and Install Python 2.7 at https://www.python.org/download/releases/2.7
2. Follow instructions to Install pip at https://pip.pypa.io/en/stable

## Installation

_Install required modules to use this tools._

```sh
python -m pip install -r requirements.txt
```

## Usage

```sh
python wsgi.py
```

You can access the app through http://localhost:5000/
![Preview](https://i.ibb.co/cczh02M/Jepretan-Layar-2021-12-12-pukul-17-40-55.png)

## Deploy

If you want to deploy this app to heroku, you need follow the instructions at https://devcenter.heroku.com/articles/git
