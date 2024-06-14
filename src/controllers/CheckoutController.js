import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import MongodbService from "../services/MongodbService.js";

export default {
  /**
   * List of documents
   * @param {*} req
   * @param {*} res
   */
  list: (req, res) => {
    let validation = Validator.check([Validator.required(req.query, "email")]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.select("orders", req.query.email)
      .then((response) => {
        let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
        Logger.out([JSON.stringify(msg)]);
        return res.json(response);
      })
      .catch((error) => {
        Logger.error([JSON.stringify(error)]);
        return res.status(500).json(error);
      });
  },

  /**
   * Create a document
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.body, "email"),
      Validator.required(req.body, "name"),
      Validator.required(req.body, "description"),
      Validator.required(req.body, "amount"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.insert("orders", {
      email: req.body.email,
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      paid: false,
    })
      .then((response) => {
        let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
        Logger.out([JSON.stringify(msg)]);
        return res.json(response);
      })
      .catch((error) => {
        Logger.error([JSON.stringify(error)]);
        return res.status(500).json(error);
      });
  },

  /**
   * View selected document
   * @param {*} req
   * @param {*} res
   * @returns
   */
  read: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.params, "order_uid"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.get("orders", req.params.order_uid)
      .then((response) => {
        let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
        Logger.out([JSON.stringify(msg)]);
        return res.json(response);
      })
      .catch((error) => {
        Logger.error([JSON.stringify(error)]);
        return res.status(500).json(error);
      });
  },

  /**
   * Update selected document
   * @param {*} req
   * @param {*} res
   * @returns
   */
  update: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.params, "order_uid"),
      Validator.required(req.body, "name"),
      Validator.required(req.body, "description"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.update("orders", req.params.order_uid, {
      name: req.body.name,
      description: req.body.description,
    })
      .then((response) => {
        let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
        Logger.out([JSON.stringify(msg)]);
        return res.json(response);
      })
      .catch((error) => {
        Logger.error([JSON.stringify(error)]);
        return res.status(500).json(error);
      });
  },

  /**
   * Archive selected document
   * @param {*} req
   * @param {*} res
   * @returns
   */
  delete: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.params, "order_uid"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.update("orders", req.params.order_uid, {
      active: false,
    })
      .then((response) => {
        let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
        Logger.out([JSON.stringify(msg)]);
        return res.json(response);
      })
      .catch((error) => {
        Logger.error([JSON.stringify(error)]);
        return res.status(500).json(error);
      });
  },

  purchase: async (req, res) => {
    /**
     * Purchase statuses
     * 1. pending
     * 2. paid
     */

    let validation = Validator.check([Validator.required(req.query, "email")]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    try {
      let orders = await MongodbService.select("orders", req.query.email);
      let results = [];

      orders.forEach(async (order) => {
        results.push(
          await MongodbService.update("orders", order._id, {
            paid: true,
            active: false,
          })
        );
      });

      let msg = { msg: `${req.method} ${req.originalUrl} ${res.statusCode}` };
      Logger.out([JSON.stringify(msg)]);
      return res.json(results);
    } catch (error) {
      Logger.error([JSON.stringify(error)]);
      return res.status(500).json(error);
    }
  },
};
