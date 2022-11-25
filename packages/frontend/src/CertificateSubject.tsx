import { Card, Typography } from "@mui/material";
import { ICertificateSubjectMetadata } from "./CertificateViewer";
import FormField from "./FormField";

interface ICertificateSubjectProps {
	data: ICertificateSubjectMetadata;
	subject: string;
}

const CertificateSubject = (props: ICertificateSubjectProps) => {
	const { data, subject } = props;
	const {
		common_name,
		country_name,
		email_address,
		locality_name,
		organization_name,
		state_or_province_name,
	} = data;
	return (
		<Card variant="elevation" style={{ padding: "1em" }}>
			<Typography variant="h6">Datos del {subject}:</Typography>
			<FormField field={"Common Name"} value={common_name}></FormField>
			<FormField
				field={"Organization Name"}
				value={organization_name}
			></FormField>
			<FormField field={"Country Name"} value={country_name}></FormField>
			<FormField
				field={"State or Province Name"}
				value={state_or_province_name}
			></FormField>
			<FormField
				field={"Locality Name"}
				value={locality_name}
			></FormField>
			<FormField
				field={"Email Address"}
				value={email_address}
			></FormField>
		</Card>
	);
};

export default CertificateSubject;
