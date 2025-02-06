import { DataTypes, Model } from "sequelize";
import sequelize from "./dbInitialize";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public refreshToken?: string | null;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public streetAddress!: string;
  public streetAddressTwo?: string;
  public city!: string;
  public planet!: string;
  public postalCode!: string;
  public resetPasswordToken?: string | null;
  public resetPasswordExpires?: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          msg: "Invalid email address format",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z]+$/,
          msg: "First name must contain only letters",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z]+$/,
          msg: "Last name must contain only letters",
        },
      },
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s,'-]+$/,
          msg: "Street address can only contain letters, numbers, spaces, commas, apostrophes, and hyphens",
        },
      },
    },
    streetAddressTwo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s,'-]*$/,
          msg: "Street address two can only contain letters, numbers, spaces, commas, apostrophes, and hyphens",
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z\s]+$/,
          msg: "City must contain only letters and spaces",
        },
      },
    },
    planet: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z\s]+$/,
          msg: "Planet must contain only letters and spaces",
        },
      },
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^\d{5}(-\d{4})?$/,
          msg: "Postal code can only contain either five numbers, or five numbers, a hyphen, and then four numbers",
        },
      },
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'users',
  },
);

export default User;
