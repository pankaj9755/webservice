const constants = require("./../../../../config/constants");
const logger = require("./../../../../config/winstonConfig");
const validators = require("./../../../../validators/users/customer/blog");
var WPAPI = require("wpapi");
var moment = require("moment");

const blogController = {
  /**
   * blog list
   */
  list: async (req, res) => {
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    var blogData = [];
    try {
      // You must authenticate to be able to POST (create) a post
      var wp = new WPAPI({
        endpoint: "https://blog.syked.co.za/index.php/wp-json",
        //endpoint: "https://syked.co.za/testblog/index.php/wp-json",
        // This assumes you are using basic auth, as described further below
        //username: 'someusername',
        //password: 'password'
      });
      wp.posts()
        .embed()
        .get(function (err, data) {
          if (err) {
            // handle err
            res.statusCode = 400;
            response.message = constants.SOMETHING_WENT_WRONG;
            return res.json(response);
          }
          for (var j = 0; j < data.length; j++) {
            (function (j) {
              blogData.push({
                id: data[j].id,
                date: moment(data[j].date).format("MMM DD, YYYY"),
                title: data[j].title.rendered,
                content: data[j].content.rendered,
                author: "Syked",
                view: 10,
                image:
                  data[j]._embedded["wp:featuredmedia"][0]["media_details"]
                    .sizes.medium_large.source_url,
              });
            })(j);
          }
          wp.media().get(function (err2, data2) {
            if (err2) {
              // handle err
              res.statusCode = 400;
              response.message = constants.SOMETHING_WENT_WRONG;
              return res.json(response);
            }
            for (var k = 0; k < blogData.length; k++) {
              (function (k) {
                blogData[k].media_id = data2[k].id;
                blogData[k].media_type = data2[k].media_type;
                blogData[k].url = data2[k].guid.rendered;
              })(k);
            }
            response.message = "Review successful";
            response.result = blogData;
            res.statusCode = 200;
            return res.json(response);
          });
        });
    } catch (err) {
      logger.log("error", "try-catch: blogController.list query failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * blog detail
   */
  detail: async (req, res) => {
    let id = req.params.id ? req.params.id : "";
    let media_id = req.query.media_id ? req.query.media_id : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    if (!id) {
      response.statusCode = 422;
      response.message = "Id is required.";
      return res.json(response);
    }
    if (!media_id) {
      response.statusCode = 422;
      response.message = "Media id is required.";
      return res.json(response);
    }
    var commentData = [];
    try {
      // You must authenticate to be able to POST (create) a post
      var wp = new WPAPI({
         endpoint: "https://blog.syked.co.za/index.php/wp-json",
        //endpoint: "https://syked.co.za/testblog/index.php/wp-json",
        //username: 'someusername',
        //password: 'password'
      });
      wp.posts()
        .id(id)
        .embed()
        .get(function (err, get_data) {
          if (err) {
            // handle err
            res.statusCode = 400;
            response.message = constants.SOMETHING_WENT_WRONG;
            return res.json(response);
          }
          var blogData = {
            id: get_data.id,
            date: moment(get_data.date).format("MMM DD, YYYY"),
            title: get_data.title.rendered,
            content: get_data.content.rendered,
            author: "Syked",
            view: 10,
            image:
              get_data._embedded["wp:featuredmedia"][0]["media_details"].sizes
                .medium_large.source_url,
          };
          // get comment
          wp.comments()
            .post(id)
            .perPage( 100 )
            .get(function (err2, comment_data) {
              if (err2) {
                // handle err
                res.statusCode = 400;
                response.message = constants.SOMETHING_WENT_WRONG;
                return res.json(response);
              }
              console.log('comment_data.length===',comment_data.length);
              if (comment_data.length > 0) {
                for (var j = 0; j < comment_data.length; j++) {
                  (function (j) {
                    commentData.push({
                      id: comment_data[j].id,
                      post: comment_data[j].post,
                      date: moment(comment_data[j].date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      ),
                      author_name: comment_data[j].author_name,
                      content: comment_data[j].content.rendered,
                      author_avatar_urls: comment_data[j].author_avatar_urls,
                    });
                  })(j);
                }
                blogData.comment = commentData;
              } else {
                blogData.comment = [];
              }
              blogData.comment = commentData;
              blogData.comment_count = comment_data.length;
              // get media
              wp.media()
                .id(media_id)
                .get(function (err3, media_data) {
                  if (err3) {
                    console.log(err3);
                    // handle err
                    res.statusCode = 400;
                    response.message = constants.SOMETHING_WENT_WRONG;
                    return res.json(response);
                  }
                  blogData.media_id = media_data.id;
                  blogData.media_type = media_data.media_type;
                  blogData.url = media_data.guid.rendered;
                  response.message = "Review successful";
                  response.result = blogData;
                  res.statusCode = 200;
                  return res.json(response);
                });
            });
        });
    } catch (err) {
      logger.log("error", "try-catch: blogController.list query failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },

  /**
   * add comment
   */
  addComment: async (req, res) => {
    let id = req.body.id ? req.body.id : "";
    let comment = req.body.comment ? req.body.comment : "";
    let response = {
      message: constants.SOMETHING_WENT_WRONG,
    };
    let data = {
      id,
      comment,
    };
    
    
   // check validation error
    let validator_result = await validators.addComment(data);
    if (!validator_result.validate) {
      res.statusCode = 422;
      response.message = validator_result.message;
      return res.json(response);
    }
    try {
      var wp = new WPAPI({
        endpoint: "https://blog.syked.co.za/index.php/wp-json",
        //endpoint: "https://syked.co.za/testblog/index.php/wp-json",
        // This assumes you are using basic auth, as described further below
        //username: 'someusername',
        //password: 'password'
      });
      wp.comments()
        .create({
          post: id, // The ID of the post to comment on
          author_email: res.locals.userData.email, // The email of the author
          author_name: res.locals.userData.first_name+' '+res.locals.userData.last_name, // Display name of the author
          content: comment, // The textual content of the comment
        })
        .then(function (createdComment) {
          console.log("The comment was creat-------------------");
          response.result = createdComment;
          response.message = "Comment added successful";
          res.statusCode = 200;
          console.log("The comment was created with ID " + createdComment.id);
          return res.json(response);
        })
        .catch(function (err) {
          console.log("The comment was not creat-------------------",err);
          response.result = err;
          res.statusCode = 500;
          return res.json(response);
        });
      // response.message = "Comment added successful.";
      // res.statusCode = 200;
      // return res.json(response);
    } catch (err) {
      logger.log("error", "try-catch: blogController.addcomment query failed.", err);
      res.statusCode = 500;
      return res.json(response);
    }
  },
};
// export module to use it on other files
module.exports = blogController;
