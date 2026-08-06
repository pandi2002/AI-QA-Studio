// import CheckboxGroup from "./ui/CheckboxGroup";

// import {
//     FileText,
//     Code2,
//     FileSpreadsheet,
//     FileType2,
//     Bug,
// } from "lucide-react";

// interface Props {
//     outputOptions: string[];
//     setOutputOptions: (value: string[]) => void;
// }

// const options = [
//     {
//         value: "Test Cases",
//         label: (
//             <>
//                 <FileText size={18} />
//                 Test Cases
//             </>
//         ),
//     },
//     {
//         value: "Playwright",
//         label: (
//             <>
//                 <Code2 size={18} />
//                 Playwright
//             </>
//         ),
//     },
//     {
//         value: "Excel",
//         label: (
//             <>
//                 <FileSpreadsheet size={18} />
//                 Excel
//             </>
//         ),
//     },
//     {
//         value: "PDF",
//         label: (
//             <>
//                 <FileType2 size={18} />
//                 PDF
//             </>
//         ),
//     },
//     {
//         value: "Bug Report",
//         label: (
//             <>
//                 <Bug size={18} />
//                 Bug Report
//             </>
//         ),
//     },
// ];

// export default function OutputOptions({
//     outputOptions,
//     setOutputOptions,
// }: Props) {
//     return (
//         <CheckboxGroup
//             title="📦 Output Formats"
//             options={options}
//             selected={outputOptions}
//             onChange={setOutputOptions}
//             columns={3}
//         />
//     );
// }