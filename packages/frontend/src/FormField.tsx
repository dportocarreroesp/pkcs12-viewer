import { Typography } from "@mui/material";

interface IFormFieldProps {
	field: string;
	value?: string;
}

const FormField = (props: IFormFieldProps) => {
	const { field, value } = props;
	return (
		<div>
			<Typography
				variant="overline"
				display={"inline"}
				style={{ marginRight: "1em" }}
				noWrap
			>
				{field}
			</Typography>
			<Typography variant="body1" display={"inline"} noWrap>
				{value}
			</Typography>
		</div>
	);
};

export default FormField;
