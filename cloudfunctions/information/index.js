// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    const { OPENID, APPID, UNIONID } = cloud.getWXContext();
    await db.collection('information').where({
        _id: OPENID
    }).get().then(res => {
        r = res.data.length
    });
    if (r>0) {
        db.collection('information').doc(OPENID).update({
            data: {
							information: event.information,
            }
        })
    } else {
        db.collection('information').add({
            data: {
                _id: OPENID,
                information: event.information,
            }
        })
    }
}
