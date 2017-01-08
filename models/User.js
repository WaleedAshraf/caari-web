module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    // facebook id
    facebook_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    // name
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // email id
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    // token
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
  return User;
};
