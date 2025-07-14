import { useRef } from 'react';
import { Button, Input, Text, VStack, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { DocumentIcon } from '@heroicons/react/24/outline';

const CosmicButton = styled(Button)`
  background: #4299E1;
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  transition: background 0.3s ease;

  &:hover:not(:disabled) {
    background: #2B6CB0;
  }

  &:disabled {
    background: #A0AEC0;
    cursor: not-allowed;
  }
`;

function FileUpload({ file, setFile, handleExtractText }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <VStack spacing={4} align="center" p={6} bg="white" borderRadius="md" border="1px dashed #E2E8F0">
        <DocumentIcon className="h-12 w-12 text-gray-400" />
        <Text fontSize="sm" color="#718096">Upload Resume</Text>
        <Text fontSize="xs" color="#A0AEC0">Click to upload or drag and drop (PDF or DOCX files only)</Text>
        <CosmicButton onClick={handleClick} size="sm">Upload Resume</CosmicButton>
        <Input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        {file && (
          <>
            <Text color="#718096" fontSize="sm">{file.name}</Text>
            <CosmicButton onClick={handleExtractText} size="sm">Extract Text</CosmicButton>
          </>
        )}
      </VStack>
    </motion.div>
  );
}

export default FileUpload;