class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // It will do in ascending order (-) for descending order
    } else {
      this.query = this.query.sort('-createdAt price');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsSelect = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsSelect);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const maxResults = this.queryString.limit * 1 || 10;
    const jumpResults = (this.queryString.page * 1 - 1) * maxResults || 0;
    this.query = this.query.skip(jumpResults).limit(maxResults);

    return this;
  }
}

module.exports = APIFeatures;
