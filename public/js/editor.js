auth.onAuthStateChanged((user) => {
    if (!user) {
        location.replace("/admin"); 
    }
});

const blogTitleField = document.querySelector(".title");
const blogArticleField = document.querySelector(".article");
const banner = document.querySelector(".banner");

let bannerPath;

const bannerImageUpload = document.querySelector("#banner-upload");
const publishBtn = document.querySelector(".publish-btn");
const imageUpload = document.querySelector("#image-upload");

bannerImageUpload.addEventListener("change", () => {
    uploadImage(bannerImageUpload, "banner");
});

imageUpload.addEventListener("change", () => {
    uploadImage(imageUpload, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files; 
    if (file && file.type.includes("image")) {     
        const formdata = new FormData();     
        formdata.append("image", file);       
        fetch("/upload", {
            method: "post",
            body: formdata,
        })
            .then((res) => res.json())
            .then((data) => {
                if (uploadType == "image") {
                    addImage(data, file.name);
                } else {
                    bannerPath = `${location.origin}/${data}`;
                    banner.style.backgroundImage = `url("${bannerPath}")`;
                }
            });
    } else {
        alert("Upload image only");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = blogArticleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    blogArticleField.value =
        blogArticleField.value.slice(0, curPos) +
        textToInsert +
        blogArticleField.value.slice(curPos);
};

let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

publishBtn.addEventListener("click", () => {
    if (blogArticleField.value.length && blogTitleField.value.length) {
        let docName;
        if (blogID[0] == "editor") {
            
            let letters = "abcdefghijklmnopqrstuvwxyz";
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = "";
            for (let i = 0; i < 4; i++) {
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            
            docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID[0]);
        }

        let date = new Date(); 
        let blogData = {
            title: blogTitleField.value,
            article: blogArticleField.value,
            publishedAt: `${date.getDate()} ${
                months[date.getMonth()]
            } ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0],
        };

        if (bannerPath) {
            blogData.bannerImage = bannerPath;
        }
        
        db.collection("blogs")
            .doc(docName)
            .set(blogData)
            .then(() => {
                location.href = `/${docName}`;
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

let blogID = location.pathname.split("/");
blogID.shift(); 
if (blogID[0] != "editor") {
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if (doc.exists) {
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            blogArticleField.value = data.article;
        } else {
            location.replace("/");
        }
    });
}
