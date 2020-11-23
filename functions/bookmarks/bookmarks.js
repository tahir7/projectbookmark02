const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;
  // require('dotenv').config();


const typeDefs = gql`
  
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
    id1 : String
  }
  type Mutation {
    addBookmark(url: String!, desc: String!) : Bookmark!
    deleteBookmark(id1: String) : Bookmark!
  }`


const authors = [
  { id: 1, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 2, url: 'https://google.com', desc: "Excellent Seach Engine" },
  { id: 3, url: 'https://yahoo.com', desc: "news, email and Search Engine" },
]

const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try{
        var client = new faunadb.Client({ secret: 'fnAD61-NQjACA2hs1xp7B-hcs9l52c1rPJaV104i' });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("urltest1"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log('read query result  ', result);
        // console.log('data  ', d.ref, '  d.ts.id ', d.ts.id, ' d.ref.id ', d.ref.id)
        
        return result.data.map(d => { 
          return {
            id: d.ref.id,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      }
      catch(err){
        console.log('err',err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, {url,desc}) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD61-NQjACA2hs1xp7B-hcs9l52c1rPJaV104i" });
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            { data: { 
              url,
              desc
             } },
          )

        );
        console.log("Document Created and Inserted in Container::::::  result.ref.id ......." + result.ref.id);
        return { 
                  id : result.ref.id,
                  url: result.data.url,
                  desc : result.data.desc
                 }

      } 
      catch (error){
          console.log('addBookmark Error: ', error);
            }
     
    },
  
  
  deleteBookmark : async(_, {id1}) => {
    try {
      console.log('server - deleteBookmarks   ', id1  )

      const client = new faunadb.Client({'secret' : 'fnAD61-NQjACA2hs1xp7B-hcs9l52c1rPJaV104i'})
            
      var result = await client.query(
        q.Delete (
          q.Ref(q.Collection('links'), id1)
          // q.Ref(q.Collection('links'), '282643023928492544')
        )
      ).then((r) => console.log('deleted  ', r))
      .catch((r) =>  console.log('deleted Error ', r))


    } catch (error) {
      console.log('Error   ', error)
    }    
    return {};
     } 

    },  

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()