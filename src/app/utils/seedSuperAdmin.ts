import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IUser, Role, Status } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: Partial<IUser> = {
      name: "Admin",
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      status: Status.ACTIVE,
      approved: true,
    };

    await User.create(payload);
    // const superadmin = await User.create(payload);
    console.log("Admin Created Successfuly! \n");
    // console.log(superadmin);
  } catch (error) {
    console.log(error);
  }
};
