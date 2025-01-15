const { Users } = require("../models/Users");


exports.getUserById =  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


exports.loginController =  async (req, res) => {
  const { Email, password } = req.body;

  try {
    // Case-insensitive email search
    const user = await Users.findOne({ Email: new RegExp(`^${Email}$`, 'i') });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: 'Invalid email or password' });
    // }

    // Add this line to include userId and organizationId in the response
    res.status(200).json({ message: 'Login successful', userId: user._id, organizationId: user.organizationId });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getUserByRoleId =  async (req, res) => {
  const { organizationId, roleId } = req.query;
  try {
    // Build the query object
    const query = { organizationId };
    if (roleId) {
      query.RoleId = { $in: Array.isArray(roleId) ? roleId : [roleId] };
    }
    // Fetch users based on the query
    const users = await Users.find(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by organization and role:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}



exports.getUsersByOrganization = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const users = await Users.find({ organizationId });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by organization:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}