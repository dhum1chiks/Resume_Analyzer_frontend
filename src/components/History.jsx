import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

function History({ history }) {
  if (!history || history.length === 0) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Box p={6} bg="white" borderRadius="md" boxShadow="sm" textAlign="center">
        <ArrowPathIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
        <Heading as="h3" size="md" color="#2D3748">Analysis History</Heading>
        <Text color="#718096">No analysis history found</Text>
      </Box>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
        <Heading as="h3" size="md" mb={4} color="#2D3748">Analysis History</Heading>
        <VStack spacing={4} align="stretch">
          {history.map((attempt) => (
            <Box key={attempt.id} p={4} bg="#F7FAFC" borderRadius="md" border="1px solid #E2E8F0">
              <Text color="#2D3748"><strong>Date:</strong> {new Date(attempt.created_at).toLocaleString()}</Text>
              <Text color="#2D3748"><strong>Template:</strong> {attempt.template_id}</Text>
              <Text color="#2D3748"><strong>Tone:</strong> {attempt.tone}</Text>
              <Text color="#2D3748"><strong>Resume Preview:</strong> {attempt.resume.slice(0, 100)}...</Text>
              <Text color="#2D3748"><strong>Job Description Preview:</strong> {attempt.job_description.slice(0, 100)}...</Text>
              <Text color="#2D3748"><strong>Match Percentage:</strong> {attempt.analysis_result.match_percentage || 0}%</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </motion.div>
  );
}

export default History;