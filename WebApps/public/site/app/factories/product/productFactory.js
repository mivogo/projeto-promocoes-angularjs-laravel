app.factory('Product', function () {

  /**
   * Constructor, with class name
   */
   function Product(id, product_id, name, price, price_weight, type_weight, weight, weight_type, hasDiscount, base_price, brand, subcategory, category, image, link) {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.product_id = product_id;
    this.name = name;
    this.price = price;
    this.price_weight = price_weight;
    this.type_weight = type_weight;
    this.weight = weight;
    this.weight_type = weight_type;
    this.hasDiscount = hasDiscount;
    this.base_price = base_price;
    this.brand = brand;
    this.subcategory = subcategory;
    this.category = category;
    this.image = image;
    this.link = link;
    if(hasDiscount){
      this.discountPercentage = ((base_price-price)/base_price)*100;
    }
  }

  /**
   * Public method, assigned to prototype
   */
   Product.prototype.getFullName = function () {
    return this.firstName + ' ' + this.lastName;
  };


  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
   Product.build = function (data) {
    return new Product(
      data.id,
      data.product_id,
      data.name,
      data.price,
      data.price_weight,
      data.type_weight,
      data.weight,
      data.weight_type,
      data.hasDiscount,
      data.base_price,
      data.brand,
      data.subcategory,
      data.category,
      data.image,
      data.link
      );
  };

  /**
   * Return the constructor function
   */
   return Product;
 })