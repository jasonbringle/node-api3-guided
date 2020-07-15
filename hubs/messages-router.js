const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();



// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', validateId,(req, res) => {
    Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch (error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
  });
  
  // add an endpoint for adding new message to a hub
  router.post('/:id/messages', validateBody,(req, res) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
  });

  function validateId(req, res, next) {
    const { id } = req.params;
    Hubs.findHubMessages(id)
    .then(hub => {
      if(hub){
      req.hub = hub;
      next();
      } else{
        next({code: 404, message: 'invalid hub id'})
      }}
      )
    .catch(err =>{ 
      console.log(err);
      next({ code : 500, message: 'something'})
    })
  }
  
  function validateBody(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
      next();
    } else {
      res.status(400).json({ message: 'please include a request body' });
    }
  }
  
  module.exports = router;