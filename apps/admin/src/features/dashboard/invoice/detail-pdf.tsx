import { Document, Page, Text, View } from '@react-pdf/renderer';

const DetailPDF: React.FC = () => {
  return (
    <Document>
      <Page size="A5">
        <View>
          <Text>Hello World</Text>
        </View>
        <View>
          <Text>Invoice No</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DetailPDF;
