// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    const { OPENID, APPID, UNIONID } = cloud.getWXContext();
    let r = null;
    let c = null;
    await db.collection('user').where({
        _id: OPENID
    }).get().then(res => {
        r = res.data.length
    });
    if (r>0) {
        db.collection('user').doc(OPENID).update({
            data: {
                dis: event.dis,
            }
        })
    } else {
        db.collection('user').add({
            data: {
                _id: OPENID,
                dis: event.dis,
            }
        })
    }
}
