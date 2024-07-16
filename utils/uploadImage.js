const multer=require('multer');

module.exports.uploadImage=()=>{
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads');
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+'_'+file.originalname);
        }
    })
    return multer({storage});
}

