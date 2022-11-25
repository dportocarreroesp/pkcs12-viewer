import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { getPKCS12Metadata, UPLOAD_FILES_PATH } from "./utils";

const app = express();
const port = 3001;

// parsea el body de todos los requests que entran como si fueran json
app.use(express.json());
app.use(cors());
app.use(
	fileUpload({
		createParentPath: true,
	})
);

app.get("/", (req, res) => {
	res.json({
		message: "hello world!",
	});
});

app.post("/upload_file", async (req, res) => {
	if (!req.files) {
		res.send("error");
		return;
	}
	if (req.files && req.files.file && req.body.password) {
		const file = req.files.file;
		const password: string = req.body.password;
		try {
			if ("name" in file) {
				const filePath = `${UPLOAD_FILES_PATH}/${file.name}`;
				await file.mv(filePath);
				const certData = getPKCS12Metadata(filePath, password);
				res.json(certData);
				return;
			}
		} catch (error) {
			res.status(404).send({
				message: "invalid certificate",
			});
			throw new Error(`something went wrong!`);
		}
	}
	res.send("error");
});

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
