const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.PlatformConnection, {
				foreignKey: "userId",
				as: "platformConnections",
			});
		}
	}

	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
		},
		{
			sequelize,
			modelName: "User",
		}
	);

	return User;
};
