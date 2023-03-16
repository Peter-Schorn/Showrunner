const UserModel = require("./UserModel");

/**
 * Update the first name, last name, and email for a user's profile.
 *
 * @param userId the user id of the profile to update
 * @param {{
 *     firstName?: string | null | undefined,
 *     lastName?: string | null | undefined,
 *     email?: string | null | undefined
 * }} options the fields to update: `firstName`, `lastName`, and
 * `email`. For each present property that is not `undefined`, if the value is
 * non-`null`, then the corresponding field will be updated in the user's
 * profile, and if the value is `null`, then the corresponding field will be
 * removed from the user's profile.
 *
 * @returns {PromiseLike<any>} a promise that resolves to the updated user
 * profile
 */
exports.updateUserProfile = function(userId, options) {

    // https://www.mongodb.com/docs/manual/reference/operator/update/set/
    // https://www.mongodb.com/docs/manual/reference/operator/update/unset/

    const optionsToSet = {};
    const optionsToUnset = {};

    for (const [key, value] of Object.entries(options)) {
        if (value === null) {
            optionsToUnset[key] = "";
        }
        else if (value !== undefined) {
            optionsToSet[key] = value;
        }
    }

    console.log("updateUserProfile: options:", options);
    console.log("updateUserProfile: normalizedOptions:", optionsToSet);

    return UserModel.findByIdAndUpdate(userId, {
        $set: optionsToSet,
        $unset: optionsToUnset
    }, {
        new: true
    });

};
