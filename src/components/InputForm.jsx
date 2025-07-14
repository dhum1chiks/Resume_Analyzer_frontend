import { Box, Heading, Textarea, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CosmicTextarea = styled(Textarea)`
  background: #F7FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  padding: 0.75rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4299E1;
    box-shadow: 0 0 5px rgba(66, 153, 225, 0.3);
  }
`;

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

function InputForm({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  handleAnalyze,
  handleExportPDF,
  isLoading,
}) {
  const pulseAnimation = {
    scale: [1, 1.03, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Box>
        <Box mb={4}>
          <Heading as="h2" size="sm" mb={2} color="#2D3748">Job Description</Heading>
          <CosmicTextarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            minH="100px"
            aria-label="Job Description Input"
          />
        </Box>
        <CosmicButton
          as={motion.button}
          size="sm"
          onClick={handleAnalyze}
          isDisabled={isLoading || !resumeText || !jobDescription}
          animate={pulseAnimation}
          mb={2}
        >
          Analyze
        </CosmicButton>
        <CosmicButton
          as={motion.button}
          size="sm"
          onClick={handleExportPDF}
          isDisabled={isLoading || !resumeText}
          animate={pulseAnimation}
        >
          Export PDF
        </CosmicButton>
      </Box>
    </motion.div>
  );
}

export default InputForm;