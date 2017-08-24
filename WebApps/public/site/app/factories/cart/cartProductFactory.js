app.factory('CartProduct', function (Product) {

  /**
   * Constructor, with class name
   */
   function CartProduct(id, name, price, quantity, data, suggestions, available) {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.data = Product.build(data);
    this.suggestions = suggestions;
    this.available = available;
    this.total = price * quantity;
  }

  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
   CartProduct.build = function (data) {
    return new CartProduct(
      data.id,
      data.name,
      data.price,
      data.quantity,
      data.data,
      data.suggestions,
      data.available
      );
  };

  /**
   * Return the constructor function
   */
   return CartProduct;
 })