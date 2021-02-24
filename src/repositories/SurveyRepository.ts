import { EntityRepository, Repository } from 'typeorm';
import { Survey } from '../entities/Survey';

@EntityRepository(Survey)
class SurveyRepository extends Repository<Survey> {

}

export { SurveyRepository };