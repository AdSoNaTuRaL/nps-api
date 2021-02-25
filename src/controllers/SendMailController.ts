import path from 'path';
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            return response.status(400).json({
                error: 'User does not exists',
            });
        }

        const survey = await surveyRepository.findOne({ id: survey_id });

        if (!survey) {
            return response.status(400).json({
                error: 'Survey does not exists',
            });
        }

        const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: [{ user_id: user.id }, { value: null }],
            relations: ['user', 'survey'],
        });

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveyUserRepository.save(surveyUser);

        await SendMailService.execute(email,  survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };