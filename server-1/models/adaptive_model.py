class AdaptiveQuizSystem:
    def __init__(self, data=None):
        self.data = data

    def generate_questions(self, num_questions=20):
        import random
        return random.sample(self.data, k=num_questions)
