const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { usernames, emails, thoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await User.deleteMany({});

    await Thought.deleteMany({});

    console.log('==============Collections Emptied==============')

    const user = [];

    function userData(){
        for(var i = 0; i < usernames.length; i++) {
            const userObject = {
                username: usernames[i],
                email: emails[i]
            }
            user.push(userObject)
        }
    };

    userData();

    await User.collection.insertMany(user);

    console.table(user)
    console.log('==============Users Seeded==============')

    const thought = [];

    function thoughtData(){
        for (var i = 0; i < usernames.length; i++) {
            const thoughtObject = {
                username: usernames[i],
                thoughtText: thoughts[i]
            }
            thought.push(thoughtObject)
        }
    }

    thoughtData();

    await Thought.collection.insertMany(thought);
    
    console.table(thought);
    console.log('==============Thoughts Seeded==============')
    
    console.info('Seeding complete! 🌱');
    
    process.exit(0);
});
