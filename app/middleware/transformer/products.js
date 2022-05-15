exports.toLowerCase = (req, res, next) => {
  req.body.type = req.body.type.toLowerCase();
  req.body.productName = req.body.productName.toLowerCase();
  req.body.packing = req.body.packing.toLowerCase();
  req.body.size = req.body.size.toLowerCase();
  next();
};
