const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const mongodb = require('hapi-mongodb');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    
    await server.register([{
        plugin: Inert
    },{

        plugin: mongodb,
    
        options: {
    
          url: 'mongodb+srv://dbUsername:AeE6mPMVUe1DAWDd@cluster0.6mmhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    
          settings : {
    
            useUnifiedTopology: true
    
          },
    
          decorate: true
    
        }
    
    }]);
    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('page.html');;
        }
    },{
        method: 'GET',
        path: '/login',
        handler: (request, h)=>{
            return h.file('loginpage.html');
        }
    },{
        method:'POST',
        path:'/login',
        handler: async (request, h) => {
            const payload = request.payload;
            const data = await request.mongo.db.collection('myFirstCollection').findOne({'username':payload.username});
            if (data && payload.username===data.username && payload.password===data.password){
                return "<h1>logged in</h1>";
            }else{
                return h.redirect('/login');
            }
        }
    },{
        method: 'GET',
        path: '/forgotpassword',
        handler: (request, h)=>{
            return h.file('forgotpassword.html');
        }
    },{
        method:'POST',
        path:'/forgotpassword',
        handler:async (request, h) => {
            const payload = request.payload;
            const data = await request.mongo.db.collection('myFirstCollection').findOne({'username':payload.username});
            if (data && payload.username===data.username ){
                return "<h1>password changed</h1>";
            }else{
                return h.redirect('/forgotpassword');
            }
        } 
    },{
        method: 'GET',
        path: '/register',
        handler: (request, h)=>{
            return h.file('register.html');
        }
    },{
        method:'POST',
        path:'/register',
        handler: async (request, h) => {
            const payload = request.payload;
            const data = await request.mongo.db.collection('myFirstCollection').findOne({'username':payload.username});
            if (data===undefined){
                const status = await request.mongo.db.collection('myFirstCollection').insertOne(payload);
     
                //return status;
                return "<h1>registered</h1>";
            }else{
                return h.redirect('/register');
                
            }
        } 
    }]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();