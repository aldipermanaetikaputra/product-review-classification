# Tokopedia Product Review Scraper

This tool is created to scrap & get all product reviews in specific shops/sellers on Tokopedia. The purpose of creating these tools is to create a sentiment analysis model for product reviews.

## Prerequisites

You are required to install NodeJS and Yarn Package Manager to use this tools.

1. Download and Install Node JS at https://nodejs.org/en/download
2. Follow instructions to Install Yarn at https://yarnpkg.com/getting-started/install

## Installation

_Install required modules to use this tools._

```sh
yarn install
```

## Usage

Before using these tools, you need to specify the Tokopedia Shop ID that you want to get all product reviews from it.

1. Go to seller/shop target at Tokopedia Marketplace. For example: [Nestle Official Store](https://www.tokopedia.com/nestle-indonesia/)
2. Inspect Element then Find "shop/" and you will find shopID
   ![Nestle Official Store](https://i.ibb.co/jvff31q/Nestle.jpg)
   From the example above we can find that the Nestle Official Store has a **Shop ID = 2923486**
3. Run the tools with command
   ```sh
   yarn ts-node scrap.ts --id=[ShopID] --out=[OutputFile]
   ```
   For example, if we want to use Nestle Official Store as a target and the output file is "data_nestle.csv" the command is:
   ```sh
   yarn ts-node scrap.ts --id=2923486 --out=data_nestle.csv
   ```
4. Wait until the process is done
   ![Running Tools](https://i.ibb.co/X5BPbPV/Jepretan-Layar-2021-12-12-pukul-16-34-16.png)
5. Data set is ready in folder output
   ![Output Folder](https://i.ibb.co/QJ4J751/Jepretan-Layar-2021-12-12-pukul-16-37-41.png)

   ![Data Content](https://i.ibb.co/Tr2VJD6/Jepretan-Layar-2021-12-12-pukul-16-40-04.png)
   Data contains 3 fields: **Product ID, Text Review, Rating**
