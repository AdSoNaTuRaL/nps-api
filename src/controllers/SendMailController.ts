import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: 'User does not exists',
            });
        }

        const surveyAlreadyExists = await surveyRepository.findOne({ id: survey_id });

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: 'Survey does not exists',
            });
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });

        await surveyUserRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { SendMailController };