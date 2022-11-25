import { Card, Grid, Typography } from "@mui/material";
import CertificateSubject from "./CertificateSubject";
import FormField from "./FormField";

export interface IPKCS12PrivateKeyMetadata {
	modulus: string;
	publicExponent: string;
	privateExponent: string;
	prime1: string;
	prime2: string;
	exponent1: string;
	exponent2: string;
	coefficient: string;
}

export interface ICertificateSubjectMetadata {
	country_name?: string;
	common_name?: string;
	organization_name?: string;
	state_or_province_name?: string;
	locality_name?: string;
	email_address?: string;
}

export interface IPKCS12CertificateMetadata {
	issuer: ICertificateSubjectMetadata;
	subject: ICertificateSubjectMetadata;
	algorithm: string;
	modulus: string;
	publicExponent: string;
	not_before: Date;
	not_after: Date;
}

export interface IPKCS12Metadata {
	private_key_metadata?: IPKCS12PrivateKeyMetadata;
	certificate_metadata?: IPKCS12CertificateMetadata;
}

interface ICertificateViewerProps {
	data: IPKCS12Metadata;
}

const CertificateViewer = (props: ICertificateViewerProps) => {
	const { data } = props;
	const { private_key_metadata, certificate_metadata } = data;
	console.log(props);
	return (
		<Card
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "1em",
				gap: "1em",
				maxWidth: "50vw",
			}}
		>
			<Card
				variant="outlined"
				style={{
					display: "flex",
					flexDirection: "column",
					padding: "1em",
					gap: "1em",
				}}
			>
				<Typography variant="h5">Datos de la clave privada:</Typography>
				<FormField
					field={"Public Exponent(e)"}
					value={private_key_metadata?.publicExponent}
				></FormField>
				<FormField
					field={"Private Exponent(d)"}
					value={private_key_metadata?.privateExponent}
				></FormField>
				<FormField
					field={"Modulus(n)"}
					value={private_key_metadata?.modulus}
				></FormField>
				<FormField
					field={"prime1(p)"}
					value={private_key_metadata?.prime1}
				></FormField>
				<FormField
					field={"prime2(q)"}
					value={private_key_metadata?.prime2}
				></FormField>
				<FormField
					field={"delta prime1(dp)"}
					value={private_key_metadata?.exponent1}
				></FormField>
				<FormField
					field={"delta prime1(dq)"}
					value={private_key_metadata?.exponent2}
				></FormField>
				<FormField
					field={"coefficient"}
					value={private_key_metadata?.coefficient}
				></FormField>
			</Card>
			<Card
				variant="outlined"
				style={{
					display: "flex",
					flexDirection: "column",
					padding: "1em",
					gap: "1em",
				}}
			>
				<Typography variant="h5">Datos del certificado:</Typography>
				{certificate_metadata?.issuer && (
					<CertificateSubject
						data={certificate_metadata?.issuer}
						subject="issuer"
					></CertificateSubject>
				)}
				{certificate_metadata?.subject && (
					<CertificateSubject
						data={certificate_metadata?.subject}
						subject="subject"
					></CertificateSubject>
				)}
				<FormField
					field="Algorithm"
					value={certificate_metadata?.algorithm}
				></FormField>
				<FormField
					field="modulus"
					value={certificate_metadata?.modulus}
				></FormField>
				<FormField
					field="Public Exponent"
					value={certificate_metadata?.publicExponent}
				></FormField>
				<FormField
					field="Not Before"
					value={certificate_metadata?.not_before.toString()}
				></FormField>
				<FormField
					field="Not after"
					value={certificate_metadata?.not_after.toString()}
				></FormField>
			</Card>
		</Card>
	);
};
export default CertificateViewer;
