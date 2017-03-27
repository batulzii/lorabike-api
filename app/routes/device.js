let mongoose = require('mongoose');

let createTTNDevice = require('../../createDevice');

let Device = require('../models/device');
let User = require('../models/user');

function getDevices(req, res){
  User.findById(req.decoded._id, (err,user) => {
    if(err) res.send(err);
    Device.find({'_id': {$in: user.devices}}, (err, devices) =>{
      if(err) res.send(err);
      res.json(devices);
    });
  });
}

function getDevice(req, res){
  Device.findById(req.params.id, (err, device) => {
    if(err) res.send(err);
    User.findById(req.decoded._id, (err, user) =>{
      if(err) res.send(err);
      if(user.devices.includes(req.params.id)){
        res.json(device);
      }else{
        res.tatus(403).send({"message" : "You are not authorised!"})
      }
    });
  });
}

function deleteDevice(req, res){
    res.send({"message": "not implemented"})
    /*Device.findById(req.params.id, (err, device) => {
      if(err) res.send(err);
      if(device.userId == req.decoded._id){
        Device.remove(req.param.id, (err, result) => {
          res.json({message : "Device successfully deleted!", result })
        });
      }else{
        return res.status(403).send({
            message: 'Not Authorised.'
        });
      }
    });*/
}

function createDevice(req, res){
  User.findById(req.decoded._id, (err, user) => {
    if(err) res.send(err);
    let newDevice = new Device(req.body);
    createTTNDevice(newDevice.name, newDevice.devEUI, "description");
    newDevice.save((err, device) =>{
      if(err) res.send(err);
      user.devices.push(newDevice._id);
      user.save((err, user) =>{
        if(err) res.send(err);
        res.json({message:"Device Created!", newDevice})
      });
    });
  });
}

function updateDevice(req, res){
  res.send({"message": "not implemented"})
  /*Device.findById(req.params.id, (err, device) => {
      if(err) res.send(err);
      if(device.userId == req.decoded._id){
        Object.assign(device, req.body).save((err, device) => {
          if(err) res.send(err);
          res.json({message: "Device updated!", device});
        });
      }else{
        return res.status(403).send({
            message: 'Not Authorised.'
        });
      }
    });*/

}

module.exports = {getDevices, getDevice, createDevice, deleteDevice, updateDevice}
