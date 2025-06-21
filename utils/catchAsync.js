//Wrap function => for try catch
export const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};
