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
    MongodbService.all("orders")
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
      Validator.required(req.body, "name"),
      Validator.required(req.body, "description"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.insert("orders", {
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
   * View selected document
   * @param {*} req
   * @param {*} res
   * @returns
   */
  read: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.params, "catalog_uid"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.get("orders", req.params.catalog_uid)
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
      Validator.required(req.params, "catalog_uid"),
      Validator.required(req.body, "name"),
      Validator.required(req.body, "description"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.update("orders", req.params.catalog_uid, {
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
      Validator.required(req.params, "catalog_uid"),
    ]);

    if (!validation.pass) {
      Logger.error([JSON.stringify(validation)]);
      return res.status(422).json(validation.result);
    }

    MongodbService.update("orders", req.params.catalog_uid, {
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
};
