/*
  This tools is to scrap all product reviews in specific shop/seller on Tokopedia
  Use this wisely. Created by Aldi Permana Etika Putra (aldipermana@hotmail.com)
*/

import axios from "axios";
import minimist from "minimist";
import { writeFileSync } from "fs";

const fetchProducts = async (shopID: string) => {
  const response = await axios({
    url: "https://gql.tokopedia.com/",
    method: "post",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Language": "id",
      "Accept-Encoding": "gzip, deflate, br",
      Origin: "https://www.tokopedia.com",
      "X-Tkpd-Lite-Service": "zeus",
      "X-Source": "tokopedia-lite",
      "X-Version": "f5989c2",
    },
    data: {
      operationName: "ShopProducts",
      variables: {
        sid: shopID,
        page: 1,
        perPage: 220,
        etalaseId: "etalase",
        sort: 11,
        user_districtId: "2274",
        user_cityId: "176",
        user_lat: "",
        user_long: "",
      },
      query:
        "query ShopProducts($sid: String!, $page: Int, $perPage: Int, $keyword: String, $etalaseId: String, $sort: Int, $user_districtId: String, $user_cityId: String, $user_lat: String, $user_long: String) {\n  GetShopProduct(shopID: $sid, filter: {page: $page, perPage: $perPage, fkeyword: $keyword, fmenu: $etalaseId, sort: $sort, user_districtId: $user_districtId, user_cityId: $user_cityId, user_lat: $user_lat, user_long: $user_long}) {\n    status\n    errors\n    links {\n      prev\n      next\n      __typename\n    }\n    data {\n      name\n      product_url\n      product_id\n      price {\n        text_idr\n        __typename\n      }\n      primary_image {\n        original\n        thumbnail\n        resize300\n        __typename\n      }\n      flags {\n        isSold\n        isPreorder\n        isWholesale\n        isWishlist\n        __typename\n      }\n      campaign {\n        discounted_percentage\n        original_price_fmt\n        start_date\n        end_date\n        __typename\n      }\n      label {\n        color_hex\n        content\n        __typename\n      }\n      label_groups {\n        position\n        title\n        type\n        url\n        __typename\n      }\n      badge {\n        title\n        image_url\n        __typename\n      }\n      stats {\n        reviewCount\n        rating\n        __typename\n      }\n      category {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
    },
  });
  if (response.status !== 200) {
    throw new Error("Status is not OK");
  }

  return response.data.data.GetShopProduct.data;
};

const fetchReviews = async (productID: string, rating: number, page = 1) => {
  const response = await axios({
    url: "https://gql.tokopedia.com/",
    method: "post",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Language": "id",
      "Accept-Encoding": "gzip, deflate, br",
      Origin: "https://www.tokopedia.com",
      "X-Tkpd-Lite-Service": "zeus",
      "X-Source": "tokopedia-lite",
      "X-Version": "f5989c2",
    },
    data: {
      operationName: "ProductReviewListQueryV2",
      variables: {
        page,
        rating,
        withAttachment: 0,
        productID,
        perPage: 10,
      },
      query: `query ProductReviewListQueryV2($productID: String!, $page: Int!, $perPage: Int!, $rating: Int!, $withAttachment: Int!) {
                ProductReviewListQueryV2(productId: $productID, page: $page, perPage: $perPage, rating: $rating, withAttachment: $withAttachment) {
                  shop {
                    shopIdStr
                    name
                    image
                    url
                    __typename
                  }
                  list {
                    reviewIdStr
                    message
                    productRating
                    reviewCreateTime
                    reviewCreateTimestamp
                    isReportable
                    isAnonymous
                    imageAttachments {
                      attachmentId
                      imageUrl
                      imageThumbnailUrl
                      __typename
                    }
                    reviewResponse {
                      message
                      createTime
                      __typename
                    }
                    likeDislike {
                      totalLike
                      likeStatus
                      __typename
                    }
                    user {
                      userId
                      fullName
                      image
                      url
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
              }
        `,
    },
  });
  if (response.status !== 200) {
    throw new Error("Status is not OK");
  }

  return response.data.data.ProductReviewListQueryV2.list;
};

let totalReview = 0;
const getAllReviews = async (id: string, outputFile: string) => {
  const page = 100;
  for (let j = 1; j <= 5; j++) {
    for (let i = 0; i < page; i++) {
      const reviews = await fetchReviews(id, j, i);
      totalReview += reviews.length;
      console.log(
        `product ${id} - rating ${j} - page ${i + 1} => got ${
          reviews.length
        } reviews | total reviews = ${totalReview}`
      );
      if (reviews.length === 0) break;
      if (reviews.map((review) => review.message).every((msg) => !msg))
        continue;
      const content =
        reviews
          .map(
            (review) =>
              `${id},${review.message.replace(/\n/g, " ").replace(/,/g, ";")},${
                review.productRating
              }`
          )
          .join("\n") + "\n";
      writeFileSync("output/" + outputFile, content, { flag: "a" });
    }
  }
};

const runScrapper = async () => {
  const argv = minimist(process.argv.slice(2));
  const shopID = argv["id"].toString();
  const output = argv["out"];

  if (!shopID) {
    throw new Error("Shop ID is requried. Run with args --id=[ShopID]");
  }

  if (!shopID) {
    throw new Error(
      "Output file is requried. Run with args --out=[OutputFile]"
    );
  }

  console.log("ShopID = ", shopID, "Output File = ./output/" + output);

  const products = await fetchProducts(shopID);
  const productsID = products.map((product) => product.product_id);
  const totalProcess = 5;
  for (let i = 0; i < productsID.length; i += totalProcess) {
    await Promise.all(
      productsID
        .slice(i, i + totalProcess)
        .map((id) => getAllReviews(id, output))
    );
  }
};

runScrapper();
