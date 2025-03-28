// ************************************************************************** //
//                                                                            //
//                                                     ______  _   _   ___    //
//   getAllNotPayedContribuable.js                    |  ____|| \ | | |_ _|   //
//                                                    | |__   |  \| |  | |    //
//   By: Mickael Joseph <mickaelandriana06@gmail.com> |  __|  | . ` |  | |    //
//                                                    | |____ | |\  | _| |_   //
//   Created: 2025/03/27 11:09:50 by Mickael Joseph  |______||_| \_||_____|   //
//   Updated: 2025/03/27 16:56:47 by Mickael Joseph                           //
//                                                                            //
// ************************************************************************** //

const {Op} = require('sequelize')
const PayementHistory =  require ('../models/PayementHistory')

exports.getAllNotPayedContribuable = async (date)  =>{
	try {
		console.log(date)
		const data = await PayementHistory.findAll({
			where:
			{
				date:{
					[Op.lte]: date
				},
			}
		})
		const cleanData = data.map((item=>item.toJSON()))
		const idData  = cleanData.map(data=>data.attributionId)
		const  msg = idData?`Here data :${idData.length}`:'Empty'
		return {msg,idData}
	} catch (e) {
		const msg  = e? e : 'erreur'
		return {msg}
	}
}

