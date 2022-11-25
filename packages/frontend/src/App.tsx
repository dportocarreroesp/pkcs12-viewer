import { Button, Card, Input, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import "./App.css";
import CertificateViewer, { IPKCS12Metadata } from "./CertificateViewer";

function App() {
	const passwordRef = useRef();
	const [file, setFile] = useState<File | null>(null);
	const [certificateData, setCertificateData] =
		useState<IPKCS12Metadata | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files?.length) {
			console.log(event.target.files![0]);
			setFile(event.target.files![0]);
		}
	};

	const handleFormSubmit = () => {
		const passwordCurrent: any = passwordRef.current;
		if (!file || !passwordCurrent?.value) {
			alert("Please, set a PKCS#12 and input your password to upload");
			return;
		}
		const url = "http://localhost:3001/upload_file";

		const formData = new FormData();
		formData.append("file", file);
		formData.append("file_name", file.name);
		formData.append("password", passwordCurrent.value);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		axios
			.post(url, formData, config)
			.then((response) => {
				setCertificateData(response.data as IPKCS12Metadata);
			})
			.catch((error) => {
				setCertificateData(null);
				alert("PKCS#12 not valid!");
			});
	};

	return (
		<div
			className="app"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				// marginTop: "5em",
                // marginBottom: "5em",
			}}
		>
			<div
				style={{ display: "flex", flexDirection: "column", gap: "4em" }}
			>
				<Card
					sx={{ minWidth: 275 }}
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "1em",
						gap: "1em",
					}}
				>
					<Button variant="outlined" component="label">
						Upload #PKCS12
						<input
							type="file"
							hidden
							onChange={handleFileChange}
						></input>
					</Button>
					{file && (
						<Typography
							variant="body2"
							style={{ overflow: "hidden", marginTop: "-1em" }}
						>
							{file.name}
						</Typography>
					)}
					<TextField
						variant="outlined"
						size="small"
						label="Password"
						inputRef={passwordRef}
					></TextField>
					<Button
						variant="contained"
						style={{ marginTop: "2em" }}
						onClick={handleFormSubmit}
					>
						View
					</Button>
				</Card>

				{certificateData && (
					<CertificateViewer
						data={certificateData}
					></CertificateViewer>
				)}
			</div>
		</div>
	);
}

export default App;
