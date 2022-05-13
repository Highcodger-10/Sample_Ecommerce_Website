//using regex to modify our search for various products

class ApiFeatures{
  constructor(query, queryStr){
    this.query = query;
    this.queryStr = queryStr
  }
  //to search for the query inspite of the cases whether be it upper or lower
  search(){
    const keyword = this.queryStr.keyword? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      },
    } :{}

    // console.log(keyword);
    this.query = this.query.find({...keyword});
    return this;
  }

  filter(){
    const QueryCopy = {...this.queryStr};
    // console.log(QueryCopy);
    //Removing some field for category
    const RemoveFields = ["keyword", "page", "limit"];

    RemoveFields.forEach((key) => delete QueryCopy[key]);
    // console.log(QueryCopy);

    //filter for price and rating
    // console.log(QueryCopy);

    let queryStr = JSON.stringify(QueryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=>`$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // console.log(queryStr);
    return this;
  }


  pagination(resultperpage){
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultperpage * (currentPage - 1);
    //limit and skip are functions defined by mongodb that's why this.query has the method of limit and skip
    this.query = this.query.limit(resultperpage).skip(skip);

    return this;

  }
}

module.exports = ApiFeatures;