class BaseController {
  /**
   * @param {Function} fn
   */
  handle(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new BaseController();
