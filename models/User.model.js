const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    

  },
  password:{
  type: String,
    required: true,
    
  },
    email: {
    type: String,
    required: true,
    unique: true,
    
  }
});
