import { Box, Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ResultCard = styled(Box)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(79, 209, 197, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

function AnalysisResults({ analysisResult }) {
  if (!analysisResult) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="lg" color="#F7FAFC" fontWeight="medium">
          Analysis Results
        </Heading>
        {analysisResult.error ? (
          <Text color="#F56565" fontSize="md">{analysisResult.error}</Text>
        ) : (
          <VStack spacing={6} align="stretch">
            <ResultCard>
              <Text fontSize="md" color="#A0AEC0">
                <strong>Extracted Skills:</strong> {analysisResult.skills?.join(', ') || 'None identified'}
              </Text>
            </ResultCard>
            <ResultCard>
              <Text fontSize="md" color="#A0AEC0">
                <strong>Missing Skills:</strong> {analysisResult.missing_skills?.join(', ') || 'None identified'}
              </Text>
            </ResultCard>
            <ResultCard>
              <Text fontSize="md" color="#A0AEC0">
                <strong>Match Percentage:</strong>{' '}
                <Text as="span" fontWeight="bold" color="#2B6CB0">
                  {analysisResult.match_percentage || 0}%
                </Text>
              </Text>
            </ResultCard>
            <Box>
              <Heading as="h4" size="md" mb={3} color="#F7FAFC" fontWeight="medium">
                Suggestions
              </Heading>
              <ResultCard>
                {Array.isArray(analysisResult.suggestions) && analysisResult.suggestions.length > 0 ? (
                  analysisResult.suggestions.map((suggestion, i) => (
                    <Text key={i} fontSize="md" color="#A0AEC0">{suggestion}</Text>
                  ))
                ) : (
                  <Text fontSize="md" color="#A0AEC0">No suggestions available</Text>
                )}
              </ResultCard>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={3} color="#F7FAFC" fontWeight="medium">
                Additional Details
              </Heading>
              <ResultCard>
                {Array.isArray(analysisResult.minor_details) && analysisResult.minor_details.length > 0 ? (
                  analysisResult.minor_details.map((item, i) => (
                    <Text key={i} fontSize="md" color="#A0AEC0">
                      <strong>{item.detail}:</strong> {item.answer}
                    </Text>
                  ))
                ) : (
                  <Text fontSize="md" color="#A0AEC0">No additional details available</Text>
                )}
              </ResultCard>
            </Box>
            {analysisResult.cover_letter && (
              <Box>
                <Heading as="h4" size="md" mb={3} color="#F7FAFC" fontWeight="medium">
                  Cover Letter
                </Heading>
                <ResultCard>
                  <Text fontSize="md" color="#F7FAFC" whiteSpace="pre-wrap">
                    {analysisResult.cover_letter}
                  </Text>
                </ResultCard>
              </Box>
            )}
            {analysisResult.interview_questions && (
              <Box>
                <Heading as="h4" size="md" mb={3} color="#F7FAFC" fontWeight="medium">
                  Interview Questions
                </Heading>
                <ResultCard>
                  {Array.isArray(analysisResult.interview_questions) && analysisResult.interview_questions.length > 0 ? (
                    analysisResult.interview_questions.map((question, i) => (
                      <Text key={i} fontSize="md" color="#A0AEC0">{i + 1}. {question}</Text>
                    ))
                  ) : (
                    <Text fontSize="md" color="#A0AEC0">No interview questions available</Text>
                  )}
                </ResultCard>
              </Box>
            )}
          </VStack>
        )}
      </VStack>
    </motion.div>
  );
}

export default AnalysisResults;