import fs from "fs";
import forge from "node-forge";
export const UPLOAD_FILES_PATH = "./upload";

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

const getCertificateSubjectMetadata = (
	attributes: forge.pki.CertificateField[]
): ICertificateSubjectMetadata => {
	const subjectMetadata: ICertificateSubjectMetadata = {};
	for (const attr of attributes) {
		const attrName = attr.name;
		switch (attrName) {
			case "commonName":
				subjectMetadata.common_name = attr.value as string;
				break;
			case "countryName":
				subjectMetadata.country_name = attr.value as string;
				break;
			case "organizationName":
				subjectMetadata.organization_name = attr.value as string;
				break;
			case "stateOrProvinceName":
				subjectMetadata.state_or_province_name = attr.value as string;
				break;
			case "localityName":
				subjectMetadata.locality_name = attr.value as string;
				break;
			case "emailAddress":
				subjectMetadata.email_address = attr.value as string;
				break;
		}
	}
	return subjectMetadata;
};

export const getPKCS12Metadata = (
	filePath: string,
	password: string
): IPKCS12Metadata => {
	const fileData = fs.readFileSync(filePath, "binary");
	try {
		const p12Asn1 = forge.asn1.fromDer(fileData);
		const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

		const keys: (IPKCS12PrivateKeyMetadata | IPKCS12CertificateMetadata)[] =
			[];
		for (const safeContent of p12.safeContents) {
			for (const safeBag of safeContent.safeBags) {
				let localKeyId: string | null = null;
				if (safeBag.attributes.localKeyId) {
					localKeyId = forge.util.bytesToHex(
						safeBag.attributes.localKeyId[0]
					);
				} else {
					// no local key ID, so skip bag
					continue;
				}
				if (
					safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag &&
					safeBag.key
				) {
					try {
						const privateKey =
							safeBag.key as forge.pki.rsa.PrivateKey;
						const privKeyMetadata: IPKCS12PrivateKeyMetadata = {
							publicExponent: privateKey.e.toString(10),
							privateExponent: privateKey.d.toString(10),
							modulus: privateKey.n.toString(10),
							prime1: privateKey.p.toString(10),
							prime2: privateKey.q.toString(10),
							exponent1: privateKey.dP.toString(10),
							exponent2: privateKey.dQ.toString(10),
							coefficient: privateKey.qInv.toString(10),
						};
						keys.push(privKeyMetadata);
					} catch (error) {
						throw new Error(
							`Failed when trying to extract private key metadata.`
						);
					}
				} else if (
					safeBag.type === forge.pki.oids.certBag &&
					safeBag.cert
				) {
					try {
						const certificate = safeBag.cert;
						const certMetadata: IPKCS12CertificateMetadata = {
							issuer: getCertificateSubjectMetadata(
								certificate.issuer.attributes
							),
							subject: getCertificateSubjectMetadata(
								certificate.subject.attributes
							),
							algorithm: certificate.md.algorithm,
							modulus: (certificate.publicKey as any)?.n.toString(
								10
							),
							publicExponent: (
								certificate.publicKey as any
							)?.e.toString(10),
							not_after: certificate.validity.notAfter,
							not_before: certificate.validity.notBefore,
						};
						keys.push(certMetadata);
					} catch (error) {
						throw new Error(
							`Failed when trying to extract certificate metadata.`
						);
					}
				}
			}
		}
		let privKeyMetadata: IPKCS12PrivateKeyMetadata | undefined;
		let certMetadata: IPKCS12CertificateMetadata | undefined;
		for (const keyMetadata of keys) {
			if ("privateExponent" in keyMetadata) {
				privKeyMetadata = keyMetadata;
			} else if ("issuer" in keyMetadata) {
				certMetadata = keyMetadata;
			}
		}
		return {
			private_key_metadata: privKeyMetadata,
			certificate_metadata: certMetadata,
		};
	} catch (error) {
		throw new Error(`Wrong format or password!`);
	}
};
