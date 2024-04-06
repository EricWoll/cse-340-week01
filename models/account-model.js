const pool = require('../database');

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
) {
    try {
        const sql =
            "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_password,
        ]);
    } catch (error) {
        return error.message;
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = 'SELECT * FROM account WHERE account_email = $1';
        const email = await pool.query(sql, [account_email]);
        return email.rowCount;
    } catch (error) {
        return error.message;
    }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email]
        );
        return result.rows[0];
    } catch (error) {
        return new Error('No matching email found');
    }
}

async function getAllAcounts() {
    try {
        const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account');
        return result.rows;
    } catch (error) {
        return new Error('No accounts found');
    }
}

async function updateAccountType(account_id, account_type) {
    try {
        const sql = `UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING *`;
        const data = await pool.query(sql, [account_type, account_id]);
        return data.rows[0];
    } catch (error) {
        return new Error('No account found');
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAllAcounts, updateAccountType };
