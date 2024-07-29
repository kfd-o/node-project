import { getConnection, releaseConnection } from "../utils/connection.js";
import { requestVisit } from "../models/userModel.js";

const requestController = {
    requestVisit: async (req, res, next) => {
        const { visitor_id, homeowner_id, contact_num, classify_as, contract_start_date, contract_end_date, date_of_visit, time_of_visit } = req.body;

        if (!visitor_id || !homeowner_id || !contact_num || !classify_as || !contract_start_date || !contract_end_date || !date_of_visit || !time_of_visit) {
            return res.status(400).json({ error: 'All fields must be filled.' });
        }

        const requestData = {
            visitor_id: visitor_id,
            homeowner_id: homeowner_id,
            contact_num: contact_num,
            classify_as: classify_as,
            contract_start_date: contract_start_date,
            contract_end_date: contract_end_date,
            date_of_visit: date_of_visit,
            time_of_visit: time_of_visit
        }

        try {
            req.conn = await getConnection()

            const [result] = await requestVisit(requestData)

            if (result.affectedRows === 0) {
                return res.status(400).json({ status: 400, msg: "Request visit creation failed." });
            }

            res.status(201).json(result);
        } catch (error) {
            next(error)
        } finally {
            await releaseConnection(req);
        }
    }
}


export default requestController
