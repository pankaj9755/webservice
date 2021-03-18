const dbConnection = require('./../config/connection');
const logger = require('./../config/winstonConfig')

/**
 * A model for intration with databse for categories and subcategories table.
 */
const categoriesModel = {

    /**
     * get categories from databse
     */
    getCategories: async () => {
        // to get all categories form database query
        const query = "SELECT * FROM categories";

        // get data
        return await dbConnection.query(query, {
            type: dbConnection.QueryTypes.SELECT
        }).then(async (result) => {
            return await result;
        }).catch(async (err) => {
            logger.log('error', 'DB error: categoriesModel.getCategories.getCategoryQuery failed.', err);
            return await 'result_failed';
        });
    },

    /**
     * get subcategories from database
     */
    getSubCategories: async (allCategoryids) => {
        // get all subcategories from databse query 
        const query = "SELECT * FROM sub_categories WHERE category_id in (:inData)"

        // get data
        return await dbConnection.query(query, {
            replacements: { inData: allCategoryids },
            type: dbConnection.QueryTypes.SELECT
        }).then(async (result) => {
            return await result;
        }).catch(async (err) => {
            logger.log('error', 'DB error: categoriesModel.getSubCategories.getSubcategoriesQuery failed.', err);
            return await 'result_failed';
        });
    },

}

// export data to use in other files
module.exports = categoriesModel;
